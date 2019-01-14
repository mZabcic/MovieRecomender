import React from "react";
import { MovieEntry } from "modules/pages/MovieEntry";

class HomeMovies extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            movies: [],
            poster: []
        }

        this.getMovies = this.getMovies.bind(this);
    }


    componentDidMount() {
        this.getMovies();
    }

    getMovies = async () => {
        const api_call = await fetch(`https://api.trakt.tv/movies/popular?extended=full`, {
            headers: {
                "trakt-api-version": 2,
                'trakt-api-key': "f5293efc55dc93eaed8b59860548dda4e5826bea96498edb53823f64890a123d"
            }
        });
        const data = await api_call.json();
        data.forEach(movie => {
            fetch(`http://www.omdbapi.com/?apikey=563467c&i=` + movie.ids.imdb).then(function (response) {
					return response.json();
				}).then(function (myJson) {
                    console.log({myJson})
					this.setState(prevState => ({
						poster: [...prevState.poster, myJson.Poster]
                    }))
                    data.poster = myJson.Poster;
				}.bind(this));
        });
        this.setState({
            movies: data,
        });
    }

    handleFavourite(e) {
        console.log("tu");
    }


    render() {
        return (
            <div className="moviesHomeSection">
            <p className="moviesTitle2">Popular movies according to <b>trakt.tv</b></p>
                
                {this.state.movies.length > 0 ? this.state.movies.map((movieEntry, index) =>
                
                    <MovieEntry  movie={movieEntry} key={"movieEntryTmdb" + index.toString()}
                    poster={this.state.poster[index]} index={index} home={true} />) : "Nema rezultata"
                   
                    
                }
                
			</div>
        );
    }
}

export default HomeMovies;