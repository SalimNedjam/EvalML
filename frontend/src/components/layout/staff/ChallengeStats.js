import React, {Component} from "react";
import {connect} from "react-redux";
import axios from 'axios'
import {Bar} from 'react-chartjs-2';

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

export class ChallengeStats extends Component {

    static propTypes = {};
    state = {

        count: new Map()
    }
    function

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.fetchStats()

    }

    fetchStats() {
        const challenge = this.props.challenge;

        const token = this.props.auth.token
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        config.headers["Authorization"] = `Token ${token}`;


        axios.get('/api/submission/fetch_submission_stats/' + challenge + '/', config)
            .then(res => {

                const count = groupBy(res.data, item => item.submissions.length)
                this.setState({
                    count
                })

            }).catch(err => {

        })
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    render() {
        const label = []
        const data = []
        const backgroundColor = []
        const borderColor = []
        const _this = this
        const imax = Math.max(...this.state.count.keys())
        for (let i = 0; i <= imax; i++) {
            let r, b, v
            r = this.getRandomInt(256)
            b = this.getRandomInt(256)
            v = this.getRandomInt(256)
            backgroundColor.push('rgba(' + r + ',' + b + ',' + v + ',0.2)')
            borderColor.push('rgba(' + r + ',' + b + ',' + v + ',1)')

            label.push(i + " soumission(s)")
            if (this.state.count.get(i))
                data.push(this.state.count.get(i).length)
            else
                data.push(0)


        }


        return (<div style={{marginBottom: 20}}>
            <h4 className="text-center">Stats</h4>
            <Bar data={{
                labels: label,
                datasets: [
                    {
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        label: "# of Students",
                        data: data,
                        borderWidth: 1

                    }
                ]
            }} options={{
                tooltips: {
                    callbacks: {

                        afterLabel: function (tooltipItem, data) {
                            const array = _this.state.count.get(parseInt(tooltipItem.label.split(" ")[0]))
                            return array.map(submit => {
                                return submit.email
                            })
                        }
                    },

                },
                scales: {
                    xAxes: [{
                        barThickness: 50,
                        maxBarThickness: 100,

                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },

                    }]
                }
            }}/>

        </div>)


    }

}


const mapStateToProps = (state) => {
    return {

        auth: state.auth,

    };
};


export default connect(
    mapStateToProps
)(ChallengeStats);
