export class HttpClient {
    constructor(axios) {
        this.axios = axios;
    }
    unwrap(p) {
        return p.then((r) => r.data);
    }
    get(url, config) {
        return this.unwrap(this.axios.get(url, config));
    }
    delete(url, config) {
        return this.unwrap(this.axios.delete(url, config));
    }
    post(url, body, config) {
        return this.unwrap(this.axios.post(url, body, config));
    }
    put(url, body, config) {
        return this.unwrap(this.axios.put(url, body, config));
    }
    patch(url, body, config) {
        return this.unwrap(this.axios.patch(url, body, config));
    }
    postForm(url, form, config) {
        var _a;
        const cfg = Object.assign(Object.assign({}, (config !== null && config !== void 0 ? config : {})), { headers: Object.assign(Object.assign({}, ((_a = config === null || config === void 0 ? void 0 : config.headers) !== null && _a !== void 0 ? _a : {})), { 'Content-Type': 'multipart/form-data' }) });
        return this.unwrap(this.axios.post(url, form, cfg));
    }
}
