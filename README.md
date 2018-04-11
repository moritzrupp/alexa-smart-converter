# Smart Converter Alexa skill

This project is a simple Alexa skill for converting units. German is the only language currently implemented. It can currently convert the following units:

 - Length:
   - mm (millimeter)
   - cm (centimeter)
   - m (meter)
   - in (inch, zoll)
   - ft-us (amerikanische fuß)
   - ft (fuß)
   - mi (meilen)
 - Mass:
   - mcg (mikrogramm, microgramm)
   - mg (milligramm)
   - g (gramm)
   - kg (kilogramm)
   - oz (unze)
   - lb (pfund)
- Temperature:
   - C (celsius)
   - F (fahrenheit)
   - K (kelvin)  
- Speed:
   - m/s (meter pro sekunde)
   - km/h (k. m. h., kilometer pro stunde)
   - m/h (meter pro stunde)
   - knot (knoten)
   - ft/s (fuß pro sekunde)

## Usage

As this skill was only developed for showcase purposes, it is currently not deployed as an Amazon Alexa skill. Hence, you cannot activate this skill on your Echo, Echo dot or Alexa app. Feel free to browse for other [Alexa skills](https://www.amazon.de/alexa-skills/b/ref=topnav_storetab_a2s?ie=UTF8&node=10068460031).

## Development

If you want to further develop this skill, feel free to do so. Pull requests are welcome.

### Installation

First, you have to clone this repository:

```bash
$ git clone https://github.com/moritzrupp/alexa-smart-converter.git
$ cd alexa-smart-converter
```

Next, you have to install all the depencendies

```bash
$ yarn install
```

Due to some required secrets in the skill, please create your own `src/secrets.json` file. It is not part of the repository due to security reasons. It should contain the following:

```json
{
    "APP_ID": "<APP_ID>",
    "sessionId": "<sessionId>",
    "userId": "<userId>",
    "requestId": "<requestId>",
    "authority": "<authority>"
}
```

Where `APP_ID` should be set to the Alexa Skill ID (`amzn1.ask.skill.*`). `sessionId` is a session ID (`SessionId.*`), the `userId` has to be a valid AWS user ID (`amzn1.ask.account.*`), the `requestId` should be a request ID (`EdwRequestId.*`) and finally, the `authority` has to be a valid AWS authority (`amzn1.er-authority.echo-sdk.amzn1.ask.skill.*`).

Once all values are in place, you can start testing the skill:

```bash
$ yarn test
```

## Contact

If you have any questions or problems, feel free to open an [issue](https://github.com/moritzrupp/alexa-smart-converter/issues/new).

## Acknowledgements

The icons of the logo have been [designed by Freepik from Flaticon](https://www.flaticon.com/authors/freepik).

## License

[MIT License](LICENSE). Copyright (c) 2017-2018 Moritz Rupp (<moritz.rupp@gmail.com>).