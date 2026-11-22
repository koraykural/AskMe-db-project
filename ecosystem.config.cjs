// pm2 app definition. deploy-release on the server runs
//   pm2 startOrReload /var/www/ask-me.koraykural.com/current/ecosystem.config.cjs
// after building the release's .venv and switching `current` to it (see
// koraykural-infra). Secrets come from shared/.env, linked into each release
// as .env and loaded by run.py.
module.exports = {
  apps: [
    {
      name: 'ask-me',
      // Through the `current` symlink, so a restart picks up the new release.
      cwd: '/var/www/ask-me.koraykural.com/current',
      script: '.venv/bin/python',
      args: '-m gunicorn run:app -w 2 -b 127.0.0.1:33507',
      interpreter: 'none',
      max_memory_restart: '300M',
    },
  ],
};
