package api

import "github.com/gofrs/uuid"

type Item struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Quantity    int       `json:"quantity"`
	Purchased   bool      `json:"purchased"`
}
