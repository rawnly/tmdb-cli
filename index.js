#!/usr/bin/env node

// All the modules
require('./util/var');


program.version(pkg.version)
.option('--key <api-key>', 'Use this only if you have a valid "api-key"')
.option('--lang', 'Module language')
.option('-a --advanced', 'Advanced search')
.option('--restore', 'Restore default options');
program.parse(process.argv);

var spin = new ora('Loading film titles..')

var info = (body) => {
  let base = `http://image.tmdb.org/t/p/w500${body.poster_path}`;
  let _rate = (body.vote_average > 8) ? body.vote_average + '/10': body.vote_average + '/10';

  if (_rate < 6) {
    _rate = _rate.toString().red
  } else if (_rate > 6.5 && _rate < 7.8) {
    _rate = _rate.toString().yellow
  } else {
    _rate = _rate.toString().yellow
  }

  spacer(3)
  log(`Title: ${body.title.toString().bold}`)
  log(`Year: ${body.release_date.split('-')[2]} ${ month[body.release_date.split('-')[1][1] - 1] } ${body.release_date.split('-')[0]}`)
  log(`Rate: ${_rate} (${body.vote_count} votes)`)
  spacer(2)
  log(`Overview [${config.get('language').split('-')[0]}] :\n${body.overview.toString()}`)
  spacer(2)
  log('Poster at: ' + base)
  spacer(3)
}

var url = '', query = process.argv[2], args = process.argv.slice(2);
var month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

if ( firstRun() ) {
  log('Thanks to have downloaded this module!'.inverse)

  config.set('language', 'en-US')
  config.set('api-key', key)
}

if ( config.get('api-key') && config.get('language') ) {
  url = `https://api.themoviedb.org/3/search/movie?api_key=${config.get('api-key')}&language=${config.get('language')}&query=${encode(args.join(' '))}&page=1&include_adult=false`;
}

if (program.advanced) {
  prompt([
    {
      name: 'title',
      message: 'Title?',
      default: config.get('last-search')
    }, {
      name: 'year',
      message: 'Year?'
    }, {
      name: 'adult',
      message: 'Adult filter?',
      type: 'confirm'
    }, {
      name: 'lang',
      message: 'Language?',
      default: config.get('language')
    }
  ]).then(answ => {
    spin.text = 'Connecting to The Movie Database';
    spin.start()
    got(`https://api.themoviedb.org/3/search/movie?api_key=${config.get('api-key')}&language=${answ.lang}&query=${encode(answ.title)}&page=1&include_adult=${answ.adult}&year=${answ.year}`).then(response => {
      spin.stop();
      let body = jparse(response.body).results[0];

      clear()


      if ( jparse(response.body).results.length > 1) {
        let list = [
          {
            name: 'film',
            message: 'Select a film:',
            type: 'list',
            choices: [
              new inquirer.Separator(),
              'Exit Menu'.red,
              new inquirer.Separator()
            ]
          }
        ]

        jparse(response.body).results.forEach((item) => {
          list[0].choices.push(item.title)
        })

        prompt(list).then(answers => {
          clear()

          if (answers.film == 'Exit Menu') {
            clear()
            log('Byeee'.yellow)
            spacer(2)
            process.exit()
          }

          spin.text = 'Retriving infos...'
          spin.start()

          config.set('last-search', answ.title)
          got(`https://api.themoviedb.org/3/search/movie?api_key=${config.get('api-key')}&language=${answ.lang}&query=${encode(answ.title)}&page=1&include_adult=${answ.adult}&year=${answ.year}`).then(response => {
            spin.stop()
            info(jparse(response.body).results[0])
          })

        })
      } else {
        clear()
        spin.text = 'Retriving infos...'
        spin.start()
        got(`https://api.themoviedb.org/3/search/movie?api_key=${config.get('api-key')}&language=${answ.lang}&query=${encode(answ.title)}&page=1&include_adult=${answ.adult}&year=${answ.year}`).then(response => {
          spin.succeed()
          info(jparse(response.body).results[0])
        })

      }
    })
  })
} else if (program.lang) {

  prompt([{
    name: 'lang',
    message: 'Choose a language: ',
    type: 'list',
    choices: [
      'en-UK',
      'en-US',
      'it-IT',
      'fr-FR',
      'de-DE'
    ],
    default: 2
  }]).then(answers => {

    config.set('language', answers.lang)
    clear();
    spacer(2);
    log(`Language: ${config.get('language')}`)
    spacer(2)

  })

} else if (program.key) {

  config.set('api-key', program.key)
  clear();
  spacer(2)
  log(`Your key is now: ${config.get('api-key')}`)
  spacer(2)

} else if (program.restore) {
  var tasks = new Listr([
    {
      title: 'Restoring language to default',
      skip: () => {
        if (config.get('language') == 'en-US') {
          return 'Nothig to be restored'
        }
      },
      task: () => {
        config.set('language', 'en-US')
      }
    }, {
      title: 'Restoring api-key to default',
      skip: () => {
        if ( config.get('api-key') == key ) {
          return 'Nothing to be restored'
        }
      },
      task: () => {
        config.set('api-key', key)
      }
    }
  ])

  tasks.run().catch(err => {
    console.error(err);
  });


} else if (program.fc) {

  firstRun.clear()
  clear()
  spacer(2)
  log('FIRST RUN CLEANED')
  spacer(2)

} else {
  spin.text = 'Loading the list'
  spin.start()
  got(url).then(response => {
    spin.stop()
    let body = jparse(response.body).results[0];

    clear()


    if ( jparse(response.body).results.length > 1) {
      let list = [
        {
          name: 'film',
          message: 'Select a film:',
          type: 'list',
          choices: [
            new inquirer.Separator(),
            'Exit Menu'.red,
            new inquirer.Separator()
          ]
        }
      ]

      jparse(response.body).results.forEach((item) => {
        list[0].choices.push(item.title)
      })

      prompt(list).then(answers => {
        clear()

        spin.text = 'Getting informations...'
        spin.start()

        got(`https://api.themoviedb.org/3/search/movie?api_key=${config.get('api-key')}&language=${config.get('language')}&query=${encode(answers.film)}&page=1&include_adult=false`).then(response => {
          spin.stop()
          info( jparse(response.body).results[0] )
        })

      })
    } else {
      clear()

      if ( args.length ) {
        config.set('last-search', args.join(' '))
      }

      spin.text = 'Getting data...'
      spin.start()

      got(url).then(response => {
        spin.stop()
        info(jparse(response.body).results[0])
      })
    }
  }).catch(error => {
    spin.fail()
    throw error
  });
}
