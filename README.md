Simple Shopping Cart Demo

To run, clone this repo and build and run the container:

1. Make a .env file in the root directory with the following values:
```
DB_USER=shopper
DB_PASS=sh0p
DB_NAME=shopping_cart
DB_HOST=localhost
DB_PORT=5432
VERSION =1.0
SESSION_SECRET = QeThWmZq4t7w!z%C*F-JaNcRfUjXn2r5
```

1. Build the image:
```
docker build -t shoppingcart .
```
2. Run the image in a container:
```
docker run -p 5432:5432 veritone
```
3. In another terminal, get your container's name:
```
docker ps
```
4. Feed the name to this command to get your container's IP:
```
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' [YOUR_CONTAINER_NAME]
```
5. Plug the IP address into your browser to view the running app

If you want to run the app locally but use the container's DB, you only need to DB_HOST env var to your container's IP.
The app can be launched from the desktop like so:
```
go build && sudo ./veritone
```
