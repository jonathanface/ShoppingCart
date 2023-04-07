package api

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"veritone/sessions"
)

func DeleteItems(w http.ResponseWriter, r *http.Request) {
	sess, err := sessions.Get(r, "shopping_list")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if sess.Values["list-id"] == "" {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	decoder := json.NewDecoder(r.Body)
	listItems := []Item{}
	if err = decoder.Decode(&listItems); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	db := r.Context().Value("db").(*sql.DB)
	// only checking list_id here as a way to loosely verify we're the list owner
	stmt, err := db.Prepare("DELETE FROM list_items WHERE item_id=$1 AND list_id=$2")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	for _, item := range listItems {
		rows, err := stmt.Query(item.ID, sess.Values["list-id"])
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()
	}
	w.WriteHeader(http.StatusCreated)
}
