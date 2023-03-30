import {check, group} from "k6";
import http from "k6/http";

const host = __ENV.HOST

export function slowScenario() {
    group('stable', () => {
        [0, 10, 50, 1000].forEach(lat => {
            const res = http.get(`http://${host}/lat${lat}`)

            check(res, {
                'is success': (resp) => resp.status === 200,
                'correct body': (resp) => resp.json("lat") === lat
            })
        })
    })
}