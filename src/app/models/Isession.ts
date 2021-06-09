export interface Isession {
  username: String;
  token: String;
}
export function IsessionToAJSON(data): Isession[] {
  return data['Isession'].records.map((val) => {
    return {
      username: val[0],
      token: val[1],
    };
  });
}
