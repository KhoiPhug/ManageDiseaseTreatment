const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const methodOverride = require("method-override");
const { engine, create } = require("express-handlebars");
const app = express();
const port = 3001;

const route = require("./routes");
const db = require("./config/db");
const SortMiddleware = require("./app/middleware/SortMiddleware");

//Connect db
db.connect();

app.use(express.static(path.join(__dirname, "public")));
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use(methodOverride("_method"));

//custom middleware
app.use(SortMiddleware);

//HTTP logger
app.use(morgan("combined"));

//fix bug NEXTWORK
app.use(cors());

//Template engine
app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        helpers: {
            sum(a, b) {
                return a + b;
            },
            sortable(field, sort) {
                const sortType = field === sort.column ? sort.type : "default";

                const icons = {
                    default: "fa-solid fa-sort",
                    asc: "fa-solid fa-arrow-down-short-wide",
                    desc: "fa-solid fa-arrow-down-wide-short",
                };
                const types = {
                    default: "desc",
                    asc: "desc",
                    desc: "asc",
                };

                const icon = icons[sortType];
                const type = types[sortType];

                return `<a href="?_sort&column=${field}&type=${type}"><i
                class="${icon}"
            ></i></a>`;
            },
        },
    }),
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
