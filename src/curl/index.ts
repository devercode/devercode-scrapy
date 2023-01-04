// import shell from "shell-exec";
import { exec } from "child_process";
import {
  DvRequestOpts,
  IScraperAdapter,
  ScraperError,
  ScraperRequestError,
} from "..";
import path from "path";
import _ from "lodash";
import qs from "qs";

const shell = (cmd: string): Promise<any> => {
  return new Promise((resolve) => {
    exec(cmd, (err, stdout, stderr) => {
      resolve({
        stdout,
        stderr,
        code: err?.code ? err.code : 0,
        error: err,
      });
    });
  });
};

export type Browser = {
  name: string;
  browser: {
    name: string;
    version: string;
    os: string;
  };
  binary: string;
  wrapper_script: string;
};

export const browsers: Browser[] = [
  {
    name: "chrome99",
    browser: {
      name: "chrome",
      version: "99.0.4844.51",
      os: "win10",
    },
    binary: "curl-impersonate-chrome",
    wrapper_script: "curl_chrome99",
  },
  {
    name: "chrome100",
    browser: {
      name: "chrome",
      version: "100.0.4896.127",
      os: "win10",
    },
    binary: "curl-impersonate-chrome",
    wrapper_script: "curl_chrome100",
  },
  {
    name: "chrome101",
    browser: {
      name: "chrome",
      version: "101.0.4951.67",
      os: "win10",
    },
    binary: "curl-impersonate-chrome",
    wrapper_script: "curl_chrome101",
  },
  {
    name: "chrome104",
    browser: {
      name: "chrome",
      version: "104.0.5112.81",
      os: "win10",
    },
    binary: "curl-impersonate-chrome",
    wrapper_script: "curl_chrome104",
  },
  // {
  //   name: "chrome107",
  //   browser: {
  //     name: "chrome",
  //     version: "107.0.5304.107",
  //     os: "win10",
  //   },
  //   binary: "curl-impersonate-chrome",
  //   wrapper_script: "curl_chrome107",
  // },

  {
    name: "edge99",
    browser: {
      name: "edge",
      version: "99.0.1150.30",
      os: "win10",
    },
    binary: "curl-impersonate-chrome",
    wrapper_script: "curl_edge99",
  },
  {
    name: "edge101",
    browser: {
      name: "edge",
      version: "101.0.1210.47",
      os: "win10",
    },
    binary: "curl-impersonate-chrome",
    wrapper_script: "curl_edge101",
  },
  {
    name: "ff91esr",
    browser: {
      name: "firefox",
      version: "91.6.0esr",
      os: "win10",
    },
    binary: "curl-impersonate-ff",
    wrapper_script: "curl_ff91esr",
  },
  {
    name: "ff95",
    browser: {
      name: "firefox",
      version: "95.0.2",
      os: "win10",
    },
    binary: "curl-impersonate-ff",
    wrapper_script: "curl_ff95",
  },
  {
    name: "ff98",
    browser: {
      name: "firefox",
      version: "98.0",
      os: "win10",
    },
    binary: "curl-impersonate-ff",
    wrapper_script: "curl_ff98",
  },
  {
    name: "ff100",
    browser: {
      name: "firefox",
      version: "100.0",
      os: "win10",
    },
    binary: "curl-impersonate-ff",
    wrapper_script: "curl_ff100",
  },
  {
    name: "ff102",
    browser: {
      name: "firefox",
      version: "102.0",
      os: "win10",
    },
    binary: "curl-impersonate-ff",
    wrapper_script: "curl_ff102",
  },
  {
    name: "safari15_3",
    browser: {
      name: "safari",
      version: "15.3",
      os: "macos11.6.4",
    },
    binary: "curl-impersonate-chrome",
    wrapper_script: "curl_safari15_3",
  },
  {
    name: "safari15_5",
    browser: {
      name: "safari",
      version: "15.5",
      os: "macos12.4",
    },
    binary: "curl-impersonate-chrome",
    wrapper_script: "curl_safari15_5",
  },
];
export class Curl implements IScraperAdapter {
  proxy?: string;
  private curlPath: string;
  private browser: Browser;
  constructor(browser?: Browser, curlPath?: string) {
    if (curlPath) {
      this.curlPath = curlPath;
    } else {
      this.curlPath = path.join(__dirname, "./core");
    }

    if (browser) {
      this.browser = browser;
    } else {
      const index = _.random(0, browsers.length - 1, false);
      this.browser = browsers[index];
    }
  }
  private _stdErrorToOutPut(std: string) {
    return std;
  }
  private _stdToOutPut(std: string) {
    let payload = std.split(/\r\n/);
    payload = _.reverse(payload);
    const body = payload[0];
    const headers = {};
    let status;
    let isPage = 0;
    for (let i = 0; i < payload.length; i++) {
      if (payload[i] === "") {
        isPage = isPage + 1;
      }
      if (isPage === 1 && payload[i] !== "") {
        const header = payload[i];
        if (header.toLowerCase().includes("http/")) {
          const [__, stt] = header.split(" ");
          status = Number(stt.trim());
        } else {
          const [field, value] = header.split(": ");
          headers[field] = value;
        }
      }
      if (isPage === 2) {
        break;
      }
    }
    return {
      body,
      headers,
      status,
    };
    // const res = std.split("\n\n");
    // console.log(res);
    // const headers = res[res.length - 2];
    // const body = res[res.length - 1];
    // return {
    //   headers,
    //   body,
    // };
  }
  private _getCurlExec = () => {
    return path.join(this.curlPath, `${this.browser.wrapper_script}`);
  };

  async get<T>(
    url: string,
    opts?: DvRequestOpts
  ): Promise<{
    data: T;
    headers: Record<string, unknown>;
    status: number;
  }> {
    let headerString = "";
    if (opts.headers) {
      Object.keys(opts.headers).forEach((key) => {
        headerString = headerString += `-H '${key}: ${opts.headers[key]}' `;
      });
    }
    if (opts.params) {
      const query = qs.stringify(opts.params);
      url = `${url}?${query}`;
    }
    const curlString = `${this._getCurlExec()} ${headerString} -i -L ${
      this.proxy ? ` -x ${this.proxy}` : ""
    } --connect-timeout 30 --max-time 30 -k ${url}`;
    const { stdout, stderr, code, error } = await shell(curlString);
    if (code === 0) {
      const payload = this._stdToOutPut(stdout);
      try {
        payload.body = JSON.parse(payload.body);
      } catch (err) {}
      if ([200, 201, 301].includes(payload.status)) {
        return {
          //@ts-ignore
          data: payload.body as T,
          headers: payload.headers,
          status: payload.status,
        };
      } else {
        throw new ScraperRequestError({
          data: payload.body,
          headers: payload.headers,
          status: payload.status,
        });
      }
    } else {
      throw new ScraperError(
        `${this._stdErrorToOutPut(stderr)}  ${error ? `- ${error}` : ""}`
      );
    }
  }

  async post<T>(
    url: string,
    data: Record<string, any>,
    opts?: DvRequestOpts
  ): Promise<{ data: T; headers: Record<string, unknown>; status: number }> {
    let headerString = "";
    if (opts.headers) {
      Object.keys(opts.headers).forEach((key) => {
        headerString = headerString += `-H '${key}: ${opts.headers[key]}' `;
      });
    }

    if (opts.params) {
      const query = qs.stringify(opts.params);
      url = `${url}?${query}`;
    }
    const curlString = `${this._getCurlExec()} ${headerString} -i -L -X POST -d '${JSON.stringify(
      data
    )}'${
      this.proxy ? ` -x ${this.proxy}` : ""
    } --connect-timeout 30 --max-time 30 -k ${url}`;

    const { stdout, stderr, code, error } = await shell(curlString);
    if (code === 0) {
      const payload = this._stdToOutPut(stdout);
      try {
        payload.body = JSON.parse(payload.body);
      } catch (err) {}
      if ([200, 201, 301].includes(payload.status)) {
        return {
          //@ts-ignore
          data: payload.body as T,
          headers: payload.headers,
          status: payload.status,
        };
      } else {
        throw new ScraperRequestError({
          data: payload.body,
          headers: payload.headers,
          status: payload.status,
        });
      }
    } else {
      throw new ScraperError(
        `${this._stdErrorToOutPut(stderr)}  ${error ? `- ${error}` : ""}`
      );
    }
  }

  getBrowser(): Browser {
    return this.browser;
  }
  setBrowser(browser: Browser) {
    this.browser = browser;
  }
}
