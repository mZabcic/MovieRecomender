import React from "react";

class HomeMovies extends React.Component {



	state = {
  		movies : [],
  		poster : []
  	}


	getMovies = async () => {   
	    const api_call = await fetch(`https://api.trakt.tv/movies/popular?extended=full`,{
		  headers: {
		  	"trakt-api-version": 2,
		    'trakt-api-key': "f5293efc55dc93eaed8b59860548dda4e5826bea96498edb53823f64890a123d"
		   }
		});
	    const data = await api_call.json(); 
	  	this.setState ( { 
	  		movies : data,
	    });    
	    console.log(data);
	}

  	createTable =  () => {
  		let table = []    	    
	    let len = this.state.movies.length;
	    if(len>10) len = 10;
	    if(len > 0 ) {
		    for (let i = 0; i < len; i++) { 
		    	let id = this.state.movies[i].ids.imdb; 
		    	var poster = "";
		    	fetch(`http://www.omdbapi.com/?apikey=563467c&i=` + id).then(function(response) {
				    return response.json();
				 }) .then(function(myJson) {
				    let res = (myJson);
				  });  

 				console.log(poster); 
		      	table.push(
		      	<a href={this.state.movies[i].homepage}>
		      	<div className="movieBox">
		      	<p><b>{this.state.movies[i].title}</b></p>  
		      	<hr/>
		      	<div className="movieFlex">
		      		<div><img src="https://m.media-amazon.com/images/M/MV5BYzE5MjY1ZDgtMTkyNC00MTMyLThhMjAtZGI5OTE1NzFlZGJjXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"/></div> 
		      		<div > 
		      			<p>{this.state.movies[i].overview}</p>
		      			<p><b>Released:</b> {this.state.movies[i].released}</p>
		      			<p><b>Rating:</b> {this.state.movies[i].rating}</p>
		      		</div>
		      	</div>
		      	</div>
		      	</a>);
		    }
		} 
	    return table;
 	}


 	componentDidMount() {
		this.getMovies();
	}

	render() {  
		return ( 
			<div className="moviesHomeSection">
			{this.createTable()}
			</div>
		);
	}
}

export default HomeMovies;