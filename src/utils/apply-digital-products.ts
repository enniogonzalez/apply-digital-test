export class ApplyDigitalProducts {
  static async get(skip = 0, limit = 10) {
    const response = await fetch(
      `https://your-api-endpoint.com/products?skip=${skip}&limit=${limit}`,
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  }
}
