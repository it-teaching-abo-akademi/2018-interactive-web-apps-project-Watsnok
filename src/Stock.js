import React, { Component } from 'react';

class Stock extends Component{
    constructor(){
        super();


        this.state = {
            name: "",
            volume: 0,
            data: [],
            isLoaded: false,
            error: false,
            exchangerate: 1,
            total: 0,
            unittotal: 0
        }

        this.passTotal = this.passTotal.bind(this);
    }

    //API Key: 10SY946P4XHW29LF

    //API is called when Stock is being initialized. The values are then put into the state data.
    //Also the input is passed down and added to the states value here. This could also be done in a
    //Get initial state method.
    componentDidMount() {
        let temp = this.props.name;
        let prop = temp.split("-");
        let api = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+prop[0]+"&interval=5min&apikey=10SY946P4XHW29LF";



        fetch(api)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        data: result,
                        name: prop[0],
                        volume: prop[1]
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error,
                        name: prop[0],
                        volume: prop[1]
                    });
                }
            )



    }

    //Using a lifecycle method to check if the props exchange rate has been modified.
    //If it has been modified the internal states exchange rate is changed.
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.userID !== prevProps.userID) {
            this.fetchData(this.props.userID);

        }

        this.checkTotal();
        this.checkCurrency();

    }

    //Method that checks if the current total is different from the volumeprice.
    //Used to check if the prices needs to be updated.
    checkTotal = () => {
        let d = new Date();

        let date= d.getMonth()+1;
        console.log(date.toString().length);
        if(date.toString().length === 1){
            date = "0"+date;
        }


        let time = (d.getFullYear()+"-"+date+"-"+(d.getDate()-1)+" 15:00:00");
        console.log(time);
        let closeprice = parseFloat(this.state.data["Time Series (5min)"][time]["1. open"]).toFixed(2);
        let unitprice = Math.round((closeprice * this.state.exchangerate) * 100) / 100;
        let volumeprice = Math.round((unitprice * this.state.volume) * 100) / 100;




        //The callback method is only called when the total is still 0. Meaning before being initialized.
        //The initial value is then sent back to the parent. The value is sent not the states value because of
        //Asynchronisation.
        if(this.state.total === 0){
            console.log("Immediately")
            this.passTotal(volumeprice);

        }

        if(this.state.total !== volumeprice){
            this.setState({
                unittotal: unitprice,
                total: volumeprice
            });
        }
    }

    checkCurrency = () => {
        //The exchangerate is passed an argument when the Stock is intialized

        if(this.props.exchangerate !== this.state.exchangerate){
            //let closetotal =  Math.round((this.state.unittotal * this.state.exchangerate) * 100) / 100;
            //let volumetotal =  Math.round((this.state.total * this.state.exchangerate) * 100) / 100;

            this.setState({
                exchangerate: this.props.exchangerate
            });

        }

    }

    passTotal(e) {
        this.props.getValue(e);
    }


    render(){
        if(!this.state.isLoaded){
            return(<div>Loading...</div>);
        }else{

            let d = new Date();

            let date= d.getMonth()+1;
            console.log(date.toString().length);
            if(date.toString().length === 1){
                date = "0"+date;
            }

            let time = (d.getFullYear()+"-"+date+"-"+((d.getDate()-1)+" 15:00:00"));
            console.log(time);
            console.log(this.state.data);
            let closeprice = parseFloat(this.state.data["Time Series (5min)"][time.toString()]["1. open"]).toFixed(2);

            let unitprice = Math.round((closeprice * this.state.exchangerate) * 100) / 100; //closeprice * this.state.exchangerate
            let volumeprice =Math.round((unitprice * this.state.volume) * 100) / 100;  //unitprice * this.state.volume


            return(
                <div id={"stockstable"}>


                    <table>
                        <tbody>
                        <tr>
                            <th>{this.state.name}</th>
                            <th>{this.state.volume}</th>
                            <th> {unitprice}</th>
                            <th> {volumeprice } </th>
                            <th><button onClick={this.props.delete}>X</button></th>
                        </tr>
                        </tbody>
                    </table>
                </div>
            );
        }

    }
}

export default Stock;