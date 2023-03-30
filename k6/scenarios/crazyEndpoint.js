import {check, group} from "k6";
import http from "k6/http";

const host = __ENV.HOST

export function crazyEndpoint() {
    group('crazy', () => {
        const res = http.get(`http://${host}/crazy`)

        check(res, {
            'is success': (resp) => resp.status === 200,
        })
    })
}