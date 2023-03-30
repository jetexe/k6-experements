import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import {quickScenario} from "./scenarios/quickScenario";

export const options = {
    thresholds: {
        'http_req_duration{scenario:stress}': ['p(99)<70'], 'checks{scenario:crazy}': ['rate>0.45'],
    }, scenarios: {
        stress: {
            executor: "ramping-arrival-rate",
            preAllocatedVUs: 2000,
            timeUnit: "1s",
            exec: "quick",
            stages: [
                {duration: "1m", target: 100}, // below normal load
                {duration: "1m", target: 1000}, // normal load
                {duration: "1m", target: 2000}, // around the breaking point
                {duration: "1m", target: 5000}, // beyond the breaking point
                {duration: "30s", target: 0}, // scale down. Recovery stage.
            ],
            startTime: '5m30s'
        },
    },
};

export function quick() {
    quickScenario()
}

export function handleSummary(data) {
    return {
        'stdout': textSummary(data, {indent: ' ', enableColors: true}), // Show the text summary to stdout...
        "summary.html": htmlReport(data),
    };
}