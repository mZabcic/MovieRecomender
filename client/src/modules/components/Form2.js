import React from "react";

class Form2 extends React.Component {

	state = {
  		tracks : []
  	}


	getArtists = async () => {   
	    const api_call = await fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=b02f4ce77743619481b799a16fca4cd9&format=json&limit=10`);
	    const data = await api_call.json(); 
	  	this.setState ( { 
	  		tracks : data.tracks.track,
	    }); 
   	}

  	createTable =  () => {
  		let table = []     	    

	    let len = this.state.tracks.length;
	    if(len>10) len = 10;
	    if(len > 0 ) {
	    for (let i = 0; i < len; i++) { 
	      //Create the parent and add the children
	      table.push(<p className="song"><a href={this.state.tracks[i].url}>{this.state.tracks[i].name}</a></p>)
	    }
		}
	    return table
 	}


 	componentDidMount() {
		this.getArtists();
	}
	
	render() { 
		return ( 
			<div className="greySection">
			<p className="artistsTitle">TOP 10 trending tracks according to <b>last.fm</b></p>
			<hr/>
				{this.createTable()}
			</div>
		);
	}
}

export default Form2;