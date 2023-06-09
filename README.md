Simple Shopping Cart Demo

To run, first clone this repo, and follow these steps:

1. Build the image:
```
docker build -t shoppingcart .
```
2. Run the image in a container:
```
docker run -p 5432:5432 shoppingcart
```
3. In another terminal, get your container's name:
```
docker ps
```
4. Feed the name to this command to get your container's IP:
```
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' [YOUR_CONTAINER_NAME]
```
5. Navigate to the IP address in your browser to view the running app

To stop the container you will have to run ```docker ps stop [container_name]``` in another terminal.


If you want to run the app locally but use the container's DB, make an .env file in the root directory with the following values:
```
DB_USER=shopper
DB_PASS=sh0p
DB_NAME=shopping_cart
DB_HOST=[YOUR_CONTAINER_IP]
DB_PORT=5432
VERSION=1.0
SESSION_SECRET=QeThWmZq4t7w!z%C*F-JaNcRfUjXn2r5
```
Make sure you have all NPM dependencies installed locally as well.
The app can be launched from the desktop like so:
```
go build -o shoppingcart && sudo ./shoppingcart
```
