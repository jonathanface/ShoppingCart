package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"github.com/gorilla/mux"
)

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
			//api.RespondWithError(w, http.StatusNotFound, err.Error())
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
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

const (
	port           = ":80"
	staticFilesDir = "static/shoppingcart/build"
	servicePath    = "/api"
)

func main() {
	c := make(chan os.Signal)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		fmt.Println("wtf")
		<-c
		os.Exit(1)
	}()

	fmt.Println("Launching ShoppingCart version", os.Getenv("VERSION"))
	fmt.Println("Listening for http on " + port)
	rtr := mux.NewRouter()
	rtr.PathPrefix("/").HandlerFunc(serveRootDirectory)
	http.Handle("/", rtr)
	log.Fatal(http.ListenAndServe(port, nil))
}
