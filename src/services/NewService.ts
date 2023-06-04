import type Types from '../typings';

export default class NewService {
  static async getList(lang: string) {
    const response = await fetch(`/news/${lang}/map.json`);
    const json = await response.json() as Types.NewMapping;
    return json.list;
  }

  static async getDetails(lang: string, to: string) {
    const response = await fetch(`/guilds/${lang}/${to}`);
    return response.text();
  }
}
