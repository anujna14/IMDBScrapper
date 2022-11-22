const axios = require("axios");
const cheerio = require("cheerio");
// const pretty = require("pretty");
import * as O from "optics-ts";
// const fs = require("fs");

const url = "https://www.imdb.com/search/title/?groups=top_250&sort=user_rating";

const getStarsData = ($: any, starElement: any, actors: string[]) => {
  starElement.map((index: number) => {
    if (index > 0) {
      actors.push($(starElement[index]).text());
    }
  });
};

interface movieContentType {
  idx: number;
  title: string;
  year: string;
  ratings: number;
  genre: string;
  director: string;
  stars: string[];
}
const movies: movieContentType[] = [];

const getMovieIndexValue = (movieTitle: string) => {
  const index = movies.findIndex((val) => val.title === movieTitle);
  return index;
};

const getMovieDetails = (movieName: string) => {
  const index = getMovieIndexValue(movieName);
  if (index !== -1) {
    const movieTitle = O.optic<movieContentType>().prop("title");
    console.log(O.get(movieTitle)(movies[index]));
  } else {
    return console.log("Movie not found");
  }
};

const updateMovieDetails = (movieName: string, parameterToBeupdated: any, value: string | number) => {
  //   console.log(`movieName: ${movieName}
  //     parameterToBeupdated: ${parameterToBeupdated}
  //     value: ${value}`);
  const index = getMovieIndexValue(movieName);
  if (index !== -1) {
    const updatedMovieDetails = O.optic<movieContentType>().prop(parameterToBeupdated);
    console.log(O.set(updatedMovieDetails)(value)(movies[index]));
  } else {
    return console.log("Movie not Found");
  }
};

const getMovieData = async () => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const listItems = $("div[class='lister-item-content']");

    listItems.each((idx: number, el: any) => {
      //   const starElement = $(el).find("p:nth-child(2)").children("a");
      const starElement: movieContentType = $(el).children("p").eq(2).children("a");
      // console.log("starElement*****", starElement);
      const movieContent = { idx, title: "", year: "", ratings: 0, genre: "", director: "", stars: [] };
      movieContent.idx = idx + 1;
      movieContent.title = $(el).children("h3").children("a").text();
      movieContent.year = $(el).children("h3").children("span").last().text();
      movieContent.ratings = $(el).find(".ratings-bar").children("div").find("strong").text();
      movieContent.genre = $(el).children("p").first().children("span").last().text().trim();
      movieContent.director = $(el).children("p").children("a").first().text();
      getStarsData($, starElement, movieContent.stars);
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
  } catch (error) {
    console.log(error);
  }
};
getMovieData();
