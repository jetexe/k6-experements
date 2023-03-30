import {quickScenario} from "./scenarios/quickScenario.js";
import {slowScenario} from "./scenarios/slowScenario.js";
import {jUnit} from "https://raw.githubusercontent.com/simbadltd/k6-junit/main/index.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.2/index.js";

export const options = {
    thresholds: {
        'http_req_duration{scenario:slow}': ['p(99)<1010'],
        'http_req_duration{scenario:quick}': ['p(99)<60'],
        'checks': ['rate>0.99'],
    },
    scenarios: {
        quick: {
            executor: 'constant-arrival-rate',
            rate: 90,
            timeUnit: '30s',
            duration: '30s',
            preAllocatedVUs: 10,
            exec: 'quick',
        },
        slow: {
            executor: 'constant-arrival-rate',
            rate: 90,
            timeUnit: '30s',
            duration: '30s',
            preAllocatedVUs: 10,
            exec: 'slow',
            startTime: '30s'
        },
    },
};

export function quick() {
    quickScenario()
}

export function slow() {
    slowScenario()
}

export function handleSummary(data) {
    console.log(jUnit(data))

    return {
        'stdout': textSummary(data, {indent: ' ', enableColors: true}), // Show the text summary to stdout...
        "results.xml": jUnit(data),
    };
}