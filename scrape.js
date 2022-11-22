"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios = require("axios");
var cheerio = require("cheerio");
// const pretty = require("pretty");
var O = require("optics-ts");
// const fs = require("fs");
var url = "https://www.imdb.com/search/title/?groups=top_250&sort=user_rating";
var getStarsData = function ($, starElement, actors) {
    starElement.map(function (index) {
        if (index > 0) {
            actors.push($(starElement[index]).text());
        }
    });
};
var movies = [];
var getMovieIndexValue = function (movieTitle) {
    var index = movies.findIndex(function (val) { return val.title === movieTitle; });
    return index;
};
var getMovieDetails = function (movieName) {
    var index = getMovieIndexValue(movieName);
    if (index !== -1) {
        var movieTitle = O.optic().prop("title");
        console.log(O.get(movieTitle)(movies[index]));
    }
    else {
        return console.log("Movie not found");
    }
};
var updateMovieDetails = function (movieName, parameterToBeupdated, value) {
    //   console.log(`movieName: ${movieName}
    //     parameterToBeupdated: ${parameterToBeupdated}
    //     value: ${value}`);
    var index = getMovieIndexValue(movieName);
    if (index !== -1) {
        var updatedMovieDetails = O.optic().prop(parameterToBeupdated);
        console.log(O.set(updatedMovieDetails)(value)(movies[index]));
    }
    else {
        return console.log("Movie not Found");
    }
};
var getMovieData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, $_1, listItems, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.get(url)];
            case 1:
                data = (_a.sent()).data;
                $_1 = cheerio.load(data);
                listItems = $_1("div[class='lister-item-content']");
                listItems.each(function (idx, el) {
                    //   const starElement = $(el).find("p:nth-child(2)").children("a");
                    var starElement = $_1(el).children("p").eq(2).children("a");
                    // console.log("starElement*****", starElement);
                    var movieContent = { idx: idx, title: "", year: "", ratings: 0, genre: "", director: "", stars: [] };
                    movieContent.idx = idx + 1;
                    movieContent.title = $_1(el).children("h3").children("a").text();
                    movieContent.year = $_1(el).children("h3").children("span").last().text();
                    movieContent.ratings = $_1(el).find(".ratings-bar").children("div").find("strong").text();
                    movieContent.genre = $_1(el).children("p").first().children("span").last().text().trim();
                    movieContent.director = $_1(el).children("p").children("a").first().text();
                    getStarsData($_1, starElement, movieContent.stars);
                    movies.push(movieContent);
                });
                // console.dir(movies);
                //   fs.writeFile("movies.json", JSON.stringify(movies, null, 2), (err: any) => {
                //     if (err) {
                //       console.log(err);
                //       return;
                //     }
                //     console.log("successfully written data to file");
                //   });
                getMovieDetails("Fight Club"); // to get the movie
                updateMovieDetails("The Shawshank Redemption", "genre", "crime"); // update the movie details
                updateMovieDetails("Schindler's List", "ratings", 9.8); // update the movie details
                updateMovieDetails(" Schindler's List", "ratings", "9.3"); //error msg since the movie not found
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
getMovieData();
