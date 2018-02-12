import { AxiosResponse } from 'axios';
import { GoogleApis } from '../src/index';
import { Endpoint } from '../src/lib/endpoint';
export declare abstract class Utils {
    static getQs(res: AxiosResponse): string | null;
    static getPath(res: AxiosResponse): string;
    static getDiscoveryUrl(name: string, version: string): string;
    static loadApi(google: GoogleApis, name: string, version: string, options?: {}): Promise<Readonly<Endpoint>>;
    static readonly noop: () => undefined;
    static readonly baseUrl: string;
}
