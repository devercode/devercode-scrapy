import { Browser, Curl } from "./curl";

export { Curl } from "./curl";

export interface DvRequestOpts {
  headers?: Record<string, any>;
  params?: Record<string, any>;
}

export interface DefaultOpts {
  headers?: Record<string, any>;
}

export class ScraperRequestError extends Error {
  status: number;
  headers: Record<any, string>;
  data: any;
  constructor({ status, headers, data }) {
    super();
    this.status = status;
    this.headers = headers;
    this.data = data;
  }
}
export class ScraperError extends Error {}
export interface IScraper {
  proxy?: string;
  get<T>(
    url: string,
    opts?: DvRequestOpts
  ): Promise<{
    data: T;
    headers: Record<string, unknown>;
    status: number;
  }>;
  post<T>(
    url: string,
    data: Record<string, any>,
    opts?: DvRequestOpts
  ): Promise<{
    data: T;
    headers: Record<string, unknown>;
    status: number;
  }>;
  setDefaultOpts(opts: DvRequestOpts): void;
}

export interface IScraperAdapter {
  proxy?: string;
  userAgent?: string;
  get<T>(
    url: string,
    opts?: DvRequestOpts
  ): Promise<{
    data: T;
    headers: Record<string, unknown>;
    status: number;
  }>;
  post<T>(
    url: string,
    data: Record<string, any>,
    opts?: DvRequestOpts
  ): Promise<{
    data: T;
    headers: Record<string, unknown>;
    status: number;
  }>;
}
export class Scraper implements IScraper {
  proxy?: string;
  constructor(
    private adapter: IScraperAdapter,
    private defaultOpts?: DefaultOpts
  ) {}

  get<T>(
    url: string,
    opts?: DvRequestOpts
  ): Promise<{
    data: T;
    headers: Record<string, unknown>;
    status: number;
  }> {
    const headers = {
      ...(this.defaultOpts?.headers ? this.defaultOpts?.headers : {}),
      ...(opts?.headers ? opts?.headers : {}),
    };
    return this.adapter.get(url, {
      ...opts,
      headers,
    });
  }

  post<T>(
    url: string,
    data: Record<string, any>,
    opts?: DvRequestOpts
  ): Promise<{
    data: T;
    headers: Record<string, unknown>;
    status: number;
  }> {
    const headers = {
      ...(this.defaultOpts?.headers ? this.defaultOpts?.headers : {}),
      ...(opts?.headers ? opts?.headers : {}),
    };
    return this.adapter.post(url, data, {
      ...opts,

      headers,
    });
  }

  useProxy(proxy: string) {
    this.proxy = proxy;
    this.adapter.proxy = proxy;
  }

  setDefaultOpts(opts: DvRequestOpts): void {
    this.defaultOpts = opts;
  }

  setCurlBrowser(browser: Browser) {
    if (!(this.adapter instanceof Curl)) {
      throw new Error("Adapter isnt Curl");
    } else {
      this.adapter.setBrowser(browser);
    }
  }

  getBrowser(): Browser {
    if (!(this.adapter instanceof Curl)) {
      throw new Error("Adapter isnt Curl");
    } else {
      return this.adapter.getBrowser();
    }
  }
}
