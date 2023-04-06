package api

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"veritone/sessions"

	"github.com/gofrs/uuid"
)

func PutListItem(w http.ResponseWriter, r *http.Request) {
	sess, err := sessions.Get(r, "shopping_list")
	fmt.Println("SESSION?", sess.Values["list-id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if sess.IsNew {
		// This is a new list, create it.
		newID, err := uuid.NewV4()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		sess.Values["list-id"] = newID.String()
		if err = sess.Save(r, w); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	fmt.Println("sessid", sess.Values["list-id"])

	//db := r.Context().Value("db").(*sql.DB)
	decoder := json.NewDecoder(r.Body)
	listItem := Item{}
	if err = decoder.Decode(&listItem); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if listItem.ID.IsNil() {
		listItem.ID, err = uuid.NewV4()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	db := r.Context().Value("db").(*sql.DB)
	var stmt *sql.Stmt
	stmt, err = db.Prepare("INSERT INTO list_items (item_id, list_id, name, description, quantity) VALUES($1, $2, $3, $4, $5) ON CONFLICT (item_id) DO UPDATE SET description=EXCLUDED.description, quantity=EXCLUDED.quantity RETURNING item_id")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer stmt.Close()
	listID, err := uuid.FromString(sess.Values["list-id"].(string))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println("inserting with", listItem.ID)
	rows, err := stmt.Query(listItem.ID, listID, listItem.Name, listItem.Description, listItem.Quantity)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	if rows.Next() {
		err := rows.Scan(&listItem.ID)
		fmt.Println("scanned", listItem.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(listItem)
}
