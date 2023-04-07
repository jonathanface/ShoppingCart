package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"
	"veritone/api"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	"github.com/gorilla/mux"
)

var db *sql.DB

func serveRootDirectory(w http.ResponseWriter, r *http.Request) {
	var (
		abs string
		err error
	)
	if abs, err = filepath.Abs("."); err != nil {
		log.Println(err.Error())
		return
	}
	cleanedPath := filepath.Clean(r.URL.Path)
	truePath := abs + string(os.PathSeparator) + staticFilesDir + cleanedPath
	if _, err := os.Stat(truePath); os.IsNotExist(err) {
		// return an error if this is a missing API request
		if strings.Contains(r.URL.Path, servicePath) {
			return
		}
		http.StripPrefix(r.URL.Path, http.FileServer(http.Dir(staticFilesDir))).ServeHTTP(w, r)
		return
	}
	http.FileServer(http.Dir(staticFilesDir+string(os.PathSeparator))).ServeHTTP(w, r)
}

func accessControlMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Normally this is where I would handle auth and/or CORS headers

		// Adding a timeout for REST endpoints
		ctx, cancel := context.WithTimeout(r.Context(), time.Duration(time.Second*5))
		defer cancel()
		ctx = context.WithValue(ctx, "db", db)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

const (
	httpPort       = ":80"
	staticFilesDir = "static/shoppingcart/build"
	servicePath    = "/api"
)

func main() {
	c := make(chan os.Signal)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-c
		os.Exit(1)
	}()

	err := godotenv.Load()
	if err != nil {
		log.Println("Unable to load .env file", err)
	}
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	if dbUser == "" || dbPass == "" || dbHost == "" || dbName == "" {
		log.Fatal("Missing DB environmental params")
	}
	fmt.Println("Launching ShoppingCart version", os.Getenv("VERSION"))
	psqlInfo := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable host=%s port=%s", dbUser, dbPass, dbName, dbHost, dbPort)
	db, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to database on port", dbPort)

	fmt.Println("Listening for http on " + httpPort)
	rtr := mux.NewRouter()

	apiPath := rtr.PathPrefix(servicePath).Subrouter()
	apiPath.Use(accessControlMiddleware)
	apiPath.HandleFunc("/items", api.GetAllItems).Methods("GET", "OPTIONS")
	apiPath.HandleFunc("/items/put", api.PutListItem).Methods("PUT", "OPTIONS")
	apiPath.HandleFunc("/items/transact", api.TogglePurchaseState).Methods("PUT", "OPTIONS")
	apiPath.HandleFunc("/items", api.DeleteItems).Methods("DELETE", "OPTIONS")

	rtr.PathPrefix("/").HandlerFunc(serveRootDirectory)
	http.Handle("/", rtr)
	log.Fatal(http.ListenAndServe(httpPort, nil))
}
