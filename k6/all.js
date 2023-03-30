import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import {quickScenario} from "./scenarios/quickScenario";
import {crazyEndpoint} from "./scenarios/crazyEndpoint";
import {slowScenario} from "./scenarios/slowScenario";
import {options as stressOptions} from "./stress";

export {quick as stressQuick} from "./stress"

export const options = {
    thresholds: stressOptions.thresholds + {
        'checks{scenario:crazy}': ['rate>0.45'],
        'http_req_duration{scenario:slow}': ['p(99)<1000'],
        'http_req_duration{scenario:quick}': ['p(99)<50'],
    },
    scenarios: {
        quick: {
            executor: 'constant-arrival-rate',
            rate: 90,
            timeUnit: '1m',
            duration: '1m',
            preAllocatedVUs: 10,
            exec: 'quick',
        },
        slow: {
            executor: 'constant-arrival-rate',
            rate: 90,
            timeUnit: '1m',
            duration: '2m',
            preAllocatedVUs: 10,
            exec: 'slow',
            startTime: '1m30s'
        },
        crazy: {
            executor: 'constant-arrival-rate',
            rate: 90,
            timeUnit: '1m',
            duration: '2m',
            preAllocatedVUs: 10,
            exec: 'crazy',
            startTime: '3m30s'
        },
        stress: stressOptions.scenarios.stress + {
            exec: "stressQuick", // Override name
            startTime: '5m30s'
        },
    },
};

export function quick() {
    quickScenario()
}

export function crazy() {
    crazyEndpoint()
}

export function slow() {
    slowScenario()
}

export function handleSummary(data) {
    return {
        'stdout': textSummary(data, {indent: ' ', enableColors: true}), // Show the text summary to stdout...
        "summary.html": htmlReport(data),
    };
}