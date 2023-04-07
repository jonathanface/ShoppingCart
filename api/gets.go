package api

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"veritone/sessions"
)

func GetAllItems(w http.ResponseWriter, r *http.Request) {
	sess, err := sessions.Get(r, "shopping_list")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if sess.Values["list-id"] == "" {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	db := r.Context().Value("db").(*sql.DB)
	stmt, err := db.Prepare("SELECT item_id, name, description, purchased FROM list_items WHERE list_id=$1")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	rows, err := stmt.Query(sess.Values["list-id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Iterate over rows and create item objects
	var items []Item
	for rows.Next() {
		var item Item
		err := rows.Scan(&item.ID, &item.Name, &item.Description, &item.Purchased)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		items = append(items, item)
	}
	fmt.Println("sending back", items)
	// Convert products to JSON and write to response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}
