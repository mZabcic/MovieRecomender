import React from "react";

const bearer_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzNiMjk3NjA0MDY5MTMwNzQ1ZjhlNWEiLCJlbWFpbCI6Im1pc2xhdi56YWJjaWNAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwic3ViIjoiNWMzYjI5NzYwNDA2OTEzMDc0NWY4ZTVhIiwiaWF0IjoxNTQ3Mzg3MzE4LCJleHAiOjE1NDc0NzM3MTgsImp0aSI6InN1YiJ9.bue1DUDeHR0j11mR7lIGq0XDLrLtHwIT81T-hIf-fQ0";

class Weather extends React.Component {

	state = {
	    temperature : undefined,
	    city : undefined,
	    country : undefined,
	    humidity : undefined,
	    description : undefined,
	    refreshDate: undefined,
	    error: undefined,
  	}



	getWeather = async () => { 
	    var bearer = 'Bearer '+ bearer_token;
	    const api_call = await fetch(`http://165.227.128.66/v1/weather`,{
		  headers: {
		    'Authorization': bearer
		   }
		});
	    const data = await api_call.json(); 
	   	var h = new Date(data.dt*1000).getHours();
	   	var m = new Date(data.dt*1000).getMinutes(); 
	   	if(m == "0") m = "00";
	   	var rd = h + ":" + m; 
	    this.setState ( {
	      temperature : "Temperature " + data.main.temp + " C",
	      city : "City: " + data.name,
	      country : "Country: " + data.sys.country,
	      humidity : "Humidity: " + data.main.humidity + " %",
	      description : "Sky: " + data.weather[0].description,
	      refreshDate : "Last refreshed: " + rd,
	      error : ""
	    });
	}
 

	componentDidMount() {
		this.getWeather();
	}
	 	
	render() { 
		return (
			<div className="weatherSection ">
			<img alt="none" className="weatherImg" src={window.location.origin + '/img/foreca.png'}></img>
				<hr/>
				<p>{this.state.country}</p>
				<p>{this.state.city}</p> 
				<p>{this.state.description}</p>
				<p>{this.state.temperature}</p>
				<p>{this.state.humidity}</p>	
				<p>{this.state.refreshDate}</p>							
			</div>
		);
	}
}

export default Weather;

