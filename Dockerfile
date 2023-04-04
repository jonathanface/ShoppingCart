FROM golang:latest

WORKDIR /app

COPY migrations /app/migrations
COPY main.go /app/main.go
COPY ./go.mod /app/go.mod
COPY ./go.sum /app/go.sum
COPY ./api /app/api
COPY ./static/shoppingcart/build/ /app/static/shoppingcart/build/
COPY entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

# Install PostgreSQL client and golang-migrate
RUN apt-get update && \
    apt-get install -y sudo && \
    apt-get install -y postgresql postgresql-contrib && \
    go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# Set environment variables
ENV DB_HOST=localhost
ENV DB_PORT=5432
ENV DB_USER=shopper
ENV DB_PASSWORD=sh0p
ENV DB_NAME=shopping_cart

RUN go build -o /app/shoppingcart
#ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD service postgresql start && \
    sleep 5 && \
    sudo -u postgres psql -c "CREATE USER shopper WITH PASSWORD '${DB_PASSWORD}';" && \
    sudo -u postgres createdb -O ${DB_USER} ${DB_NAME} && \
    migrate -path=/app/migrations -database=postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=disable up && \
    /app/shoppingcart

