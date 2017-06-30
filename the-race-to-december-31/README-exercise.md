# Tehtävä

1. Tee [Create React App](https://github.com/facebookincubator/create-react-app) -työkalulla uusi React-projekti
    * Nimi voi olla esimerkiksi "the-race-to-december-31"
1. Toteuta päivämäärävalintapeli

### Pelin säännöt
* Peli alkaa päivämäärästä *1.1.*
* Pelaaja ja tietokone valitsevat vuorotellen jonkin tulevan päivämäärän
  * Valitun päivämäärän on oltava suurempi joko päivä- tai kuukausiarvoltaan, ja toisen arvon on pysyttävä samana
    * Esimerkiksi *1.1.* jälkeen voi valita *17.1.* tai *1.3.*, mutta ei *22.10.*
    * Päiväarvo ei voi olla edellistä pienempi
      * *29.7.* jälkeen ei voi valita *22.8.*
* Voittaja on se, joka onnistuu valitsemaan päivämäärän *31.12.*
* Pelaaja aloittaa

### Pelin toteutus
1. Asenna [Airbnb React Datepicker](https://github.com/airbnb/react-dates) ja sen vaatimat muut riippuvuudet
    ```
    npm install --save-dev react-dates moment react-addons-shallow-compare
    ```
1. Käytä `<SingleDatePicker />`:iä
1. Aseta suomalainen päivämääräformaatti `displayFormat`-propilla
    * Formaatti käyttää [Moment-kirjaston päivämääräformaattia](https://momentjs.com/docs/#/displaying/format/)
1. Voit käyttää Datepickerin `isDayBlocked` -callback-funktiota päivämäärien rajaukseen
    * Funktio saa parametrina [Moment-kirjaston](https://momentjs.com/docs/) päivämääräobjektin
1. Tietokone valitsee päivämäärän oheisella funktiolla
    ```js
    import moment from 'moment';
    // getComputerMove :: (Moment a) -> Moment
    function getComputerMove(a) {
      const b = a.date();
      if (31 === b) return moment({ date: 31, month: 11 });
      const c = a.month(), d = c + 20;
      if (d < b) {
        const e = b - 20, f = moment({ date: b, month: e });
        return f.isValid() ? f : moment({ date: b, month: e + 1 });
      }
      return moment(d === b ? { date: b, month: c + 1 } : { date: d, month: c });
    }
    ```
1. Listaa jo valitut päivämäärät
1. Lisää "Uusi peli" -painike

[Lisätietoa pelistä](https://www.youtube.com/watch?v=ETb6MqCAo1Q)
