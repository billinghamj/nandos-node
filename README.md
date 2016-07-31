# nandos-node

Server-side JS library for the Nando's API. It is not publicly documented, so
may break at any time.

```js
import * as Nandos from 'nandos';

const client = new Nandos.Loyalty({
	clientKeyId: 'some_key_here', // ~30 characters
	clientKeySecret: 'some_key_here', // ~10 characters
	userEmail: 'foobar@example.com',
	userPassword: 'SoSecure0mg!',
});

const account = await client.getAccount();
const rewards = await client.getRewards(account.cardNumber);
const transactions = await client.getTransactions(account.cardNumber);

console.log(account.phoneNumber); // => 07123456789
console.log(account.card_lost); // => false
console.log(rewards.wheel_position); // => 3
console.log(rewards.lifetime_chillies); // => 13
console.log(transactions[0].store); // => Whitechapel
console.log(transactions[0].credit); // => 1
```

## Installation

```bash
$ npm install --save nandos
```

## API

All async methods return promises. Traditional Node callbacks are not supported.

Currently, only the Nando's loyalty program is supported (the reward card).

### `Loyalty`

#### `Loyalty#constructor(options)`

First, set up a client by creating an instance of `Loyalty`.

Options:

- `clientKeyId` - the key which is sent to the API as-is
- `clientKeySecret` - the key used to create the HMAC digest sent to the API
- `userEmail` - the user's email address for login
- `userPassword` - the user's password for login

```js
const client = new Loyalty({
	clientKeyId: 'some_key_here', // ~30 characters
	clientKeySecret: 'some_key_here', // ~10 characters
	userEmail: 'foobar@example.com',
	userPassword: 'SoSecure0mg!',
});
```

#### `Loyalty#getAccount()`

Verify the user's login details and retrieve their account details (including
card number).

```js
await client.getAccount();
```

#### `Loyalty#getRewards(cardNumber)`

Retrieve the card's rewards status - the number of 'chillies' they have, and the
number of green/mild, orange/med and red/hot rewards they have.

```js
await client.getRewards('12341234123412');
```

#### `Loyalty#getTransactions(cardNumber)`

Retrieve the card's historical transactions, including rewards provided from
each visit.

```js
await client.getTransactions('12341234123412');
```

## Notes

- data is provided back from the Nando's API exactly as-is - as such, many keys/values are quite inconsistent and unpredictable

## Support

Please open an issue on this repository.

## Authors

- James Billingham <james@jamesbillingham.com>

## License

MIT licensed - see [LICENSE](LICENSE) file
