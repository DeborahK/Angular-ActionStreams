import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Product } from './product';

export class ProductData implements InMemoryDbService {

  createDb() {    
    // Used to retrieve individual items
    const products: Product[] = [
      {
        id: 1,
        productName: 'Palantir',
        productCode: 'COM-0011',
        releaseDate: 'March 19, 2018',
        description: 'Genuine seeing stone',
        price: 1900.95,
        cost: 1599.0,
        starRating: 3.2,
        imageUrl: 'assets/images/palantir.jpg',
        category: 'Communications',
        tags: ['ball', 'phone']
      },
      {
        id: 2,
        productName: 'Rope',
        productCode: 'CMP-0023',
        releaseDate: 'March 18, 2018',
        description: 'Elvin rope',
        price: 32.99,
        cost: 10.00,
        starRating: 4.2,
        imageUrl: 'assets/images/rope.png',
        category: 'Camping'
      },
      {
        id: 5,
        productName: 'Sword',
        productCode: 'WEA-0048',
        releaseDate: 'May 21, 2018',
        description: 'Flame of the West',
        price: 849.9,
        cost: 520.0,
        starRating: 4.9,
        imageUrl: 'assets/images/sword.png',
        category: 'Weapons',
        tags: ['weapons', 'battle', 'elven']
      },
      {
        id: 8,
        productName: 'Ring',
        productCode: 'JWL-0022',
        releaseDate: 'May 15, 2018',
        description: 'The one ring',
        price: 111.55,
        cost: 60.0,
        starRating: 2.7,
        imageUrl: 'assets/images/ring.jpg',
        category: 'Jewelry'
      },
      {
        id: 10,
        productName: 'Evenstar',
        productCode: 'JWL-0042',
        releaseDate: 'October 15, 2018',
        description: 'Brilliant Elfstone jewel',
        price: 3500.95,
        cost: 2100.18,
        starRating: 4.9,
        imageUrl: 'assets/images/evenstar.jpg',
        category: 'Jewelry'
      },
      {
        id: 11,
        productName: 'Leaf Rake',
        productCode: 'GDN-0011',
        releaseDate: 'March 19, 2018',
        description: 'Leaf rake with 48-inch wooden handle',
        price: 19.95,
        cost: 2.00,
        starRating: 3.2,
        imageUrl: 'assets/images/leaf_rake.png',
        category: 'Garden',
        tags: ['rake', 'leaf', 'yard', 'home']
      },
      {
        id: 12,
        productName: 'Garden Cart',
        productCode: 'GDN-0023',
        releaseDate: 'March 18, 2018',
        description: '15 gallon capacity rolling garden cart',
        price: 32.99,
        cost: 18.00,
        starRating: 4.2,
        imageUrl: 'assets/images/garden_cart.png',
        category: 'Garden'
      },
      {
        id: 15,
        productName: 'Hammer',
        productCode: 'TBX-0048',
        releaseDate: 'May 21, 2018',
        description: 'Curved claw steel hammer',
        price: 8.9,
        cost: 3.50,
        starRating: 4.8,
        imageUrl: 'assets/images/hammer.png',
        category: 'Toolbox',
        tags: ['tools', 'hammer', 'construction']
      },
      {
        id: 18,
        productName: 'Saw',
        productCode: 'TBX-0022',
        releaseDate: 'May 15, 2018',
        description: '15-inch steel blade hand saw',
        price: 11.55,
        cost: 1.30,
        starRating: 3.7,
        imageUrl: 'assets/images/saw.png',
        category: 'Toolbox'
      },
      {
        id: 20,
        productName: 'Video Game Controller',
        productCode: 'GMG-0042',
        releaseDate: 'October 15, 2018',
        description: 'Standard two-button video game controller',
        price: 35.95,
        cost: .99,
        starRating: 4.6,
        imageUrl: 'assets/images/xbox-controller.png',
        category: 'Gaming'
      }
    ];

    return {products};
  }
}
