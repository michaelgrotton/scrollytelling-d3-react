import React from 'react';
import injectSheet from "react-jss";
import { Scrollama, Step } from "react-scrollama";
import nyc from "./nyc.js"
import sf from "./sf.js"
import am from "./am.js"
import BarChart from "./BarChart.js"

const styles = {
  graphic: {
    flexBasis:"60%",
    height:"300px",
    borderRadius:"5px",
    position: "sticky",
    top:"250px",
    fontSize:"40px"
  },
  description: {
    height:"600px",
    textAlign:"center",
    padding:"50px 50px",
    fontSize:"20px"
  },
  container: {
    display:"flex",
    justifyContent:"space-around",
    flexDirection:"column"
  },
  step:{
    height:"100px",
    width:"100%",
    backgroundColor:"whitesmoke",
    border:"2px solid grey",
    borderRadius:"5px",
    marginBottom:"500px",
    fontSize:"25px",
    textAlign:"center",
    lineHeight:"100px",
    zIndex:1,
    opacity:".8"
  },
  scroller: {
    flexBasis:"30%"
  },
  offset: {
    borderTop:"2px dashed black",
    marginTop:"32vh",
    position:"fixed",
    zIndex:"1",
    width:"100%"
  },
  title: {
    margin:"20px 0",
    padding:"0",
    fontSize:"25px"
  },
  "@media (min-width: 768px)": {
    container: {
      flexDirection:"row"
    },
    step: {
      '&:last-child': {
        marginBottom: "200px",
      }
    },
    description: {
      padding:"100px 250px"
    }
  }
}

const cities = ["nyc", "sf", "am"]
const cityNames = {"nyc": "New York City", "sf": "San Francisco", "am": "Amsterdam", "": ""}

class App extends React.Component {
  state = {
    temps:{},
    city: "",
    screenWidth: 0,
    screenHeight: 0
  }

  componentDidMount() {
      sf.forEach(day => (day.date = new Date(day.date)));
      nyc.forEach(day => (day.date = new Date(day.date)));
      am.forEach(day => (day.date = new Date(day.date)));
      this.setState({ temps: { sf, nyc, am } });
      window.addEventListener('resize', this.onResize, false)
      this.onResize()
  }

  onResize = () => {
    let screenWidth = window.innerWidth
    let screenHeight = window.innerHeight

    if( screenWidth > 768 ) {
      screenWidth = screenWidth * .55;
    } else {
      screenWidth = screenWidth * .90;
    }

    this.setState({screenWidth, screenHeight})
  }

  onStepEnter = ({ element, data, direction }) => {
    this.setState({ city: data });
    element.style.backgroundColor = 'lightgoldenrodyellow';
    element.style.border = '2px solid gold';
  }

  onStepExit = ({ element, data, direction }) => {
    if(data === "nyc" && direction === "up") {
      this.setState({ city: ""});
    }
    element.style.backgroundColor = 'whitesmoke';
    element.style.border = '2px solid grey';
  }

  render() {
    const { classes } = this.props
    const { city, screenWidth, screenHeight } = this.state

    return (
      <div>
        <div className={classes.offset}>trigger line</div>
        <div className={classes.description}>
          Scrollytelling is a technique used to make changes to a graphic or other ui component as a reader scrolls down a page.
          In this example, I use <a href="https://github.com/jsonkao/react-scrollama">Jason Kao's</a> React interface of the Scrollama library by <a href="https://github.com/russellgoldenberg/scrollama">Russell Goldenberg</a>, to alter a line graph
          of weather data built with D3.js as you scroll. Try it out!
        </div>
        <div className={classes.container}>
          <div className={classes.graphic}>
            <p className={classes.title}>2018 Weather in: <span style={{color:"#1aa3ff", padding:"3px", borderRadius:"2px"}}>{cityNames[city]}</span></p>
            <BarChart width={screenWidth} height={screenHeight} data={city ? this.state.temps[city] : {} } />
          </div>
          <div className={classes.scroller}>
            <Scrollama onStepEnter={this.onStepEnter} offset={.33} onStepExit={this.onStepExit}>
              {cities.map(city => {
                return(
                  <Step data={city} key={city}>
                    <div className={classes.step}>
                      {cityNames[city]} weather
                    </div>
                  </Step>
                )
              })}
            </Scrollama>
          </div>
        </div>

        <div style={{height:"600px"}}></div>
      </div>
    );
  }
}

export default injectSheet(styles)(App);
