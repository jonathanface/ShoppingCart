package api

import (
	"database/sql"
	"encoding/json"
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

	// Have to make() the slice b/c otherwise
	// you get null for cases of empty tables
	var items []Item = make([]Item, 0)
	for rows.Next() {
		var item Item
		err := rows.Scan(&item.ID, &item.Name, &item.Description, &item.Purchased)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		items = append(items, item)
	}
	// Convert products to JSON and write to response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}
