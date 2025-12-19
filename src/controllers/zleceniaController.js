const { getDb } = require('../data/connection');
async function getCollection() {
    const dbOrClient = getDb();
    if (!dbOrClient) throw new Error('getDb() zwróciło pustą wartość. Sprawdź konfigurację połączenia do MongoDB.');
    if (typeof dbOrClient.collection === 'function') {
        return dbOrClient.collection('zlecenia');
    }
    if (typeof dbOrClient.db === 'function') {
        return dbOrClient.db('baza_kompania').collection('zlecenia');
    }
    throw new Error('Nieznany obiekt zwrócony przez getDb()');
}

exports.form = async (req, res, next) => {
  try {
    // renderujemy formularz; możemy też wyświetlić krótką listę zleceń użytkownika - ale na początek tylko form
    return res.render('pages/zlecenia', {
      title: 'Zakontraktuj u nas swoj pomysl',
      errors: null,
      formData: {}
    });
  } catch (err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { nazwa_projektu, rodzaj, opis } = req.body;
    const errors = [];

    if (!nazwa_projektu || nazwa_projektu.trim().length < 3) {
      errors.push('Nazwa projektu jest wymagana (min. 3 znaki).');
    }

    const allowed = ['projekt budowy', 'budowanie (czarna robota)'];
    if (!rodzaj || allowed.indexOf(rodzaj) === -1) {
      errors.push('Wybierz poprawny rodzaj projektu.');
    }

    if (!opis || opis.trim().length < 10) {
      errors.push('Opis projektu jest za krótki (min. 10 znaków).');
    }

    if (errors.length) {
      return res.status(400).render('pages/zlecenia', {
        title: 'Zakontraktuj u nas swoj pomysl',
        errors,
        formData: { nazwa_projektu, rodzaj, opis }
      });
    }

    const collection = await getCollection();
    const doc = {
      nazwa_projektu: nazwa_projektu.trim(),
      rodzaj,
      opis: opis.trim(),
      user: req.session.user ? req.session.user.nazwa || req.session.user.id : null,
      createdAt: new Date(),
      status: 'nowe'
    };

    const result = await collection.insertOne(doc);

    return res.render('pages/zlecenia', {
      title: 'Zakontraktuj u nas swoj pomysl',
      errors: null,
      formData: {},
      success: 'Zlecenie zostało dodane pomyślnie.'
    });
  } catch (err) {
    return next(err);
  }
};
