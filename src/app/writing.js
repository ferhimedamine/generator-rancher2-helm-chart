import _ from 'lodash';

export default async function writing(yo) {
  const configMaps = _.filter(yo.context.config, { secret: false });
  const configSecrets = _.filter(yo.context.config, { secret: true });
  const publicDeployments = _.filter(yo.context.deployments, { public: true });
  yo.fs.copyTpl(
    yo.templatePath('Chart.yaml'),
    yo.destinationPath('Chart.yaml'),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('OWNERS'),
    yo.destinationPath('OWNERS'),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('README.md'),
    yo.destinationPath('README.md'),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('app-readme.md'),
    yo.destinationPath('app-readme.md'),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('questions.yaml'),
    yo.destinationPath('questions.yaml'),
    {
      ...yo.context,
      publicDeployments
    }
  );
  yo.fs.copyTpl(
    yo.templatePath('values.yaml'),
    yo.destinationPath('values.yaml'),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('templates/NOTES.txt'),
    yo.destinationPath('templates/NOTES.txt'),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('templates/_helpers.tpl'),
    yo.destinationPath('templates/_helpers.tpl'),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('templates/pvc.yaml'),
    yo.destinationPath('templates/pvc.yaml'),
    yo.context
  );
  if (publicDeployments.length) {
    yo.fs.copyTpl(
      yo.templatePath('templates/certificate.yaml'),
      yo.destinationPath('templates/certificate.yaml'),
      {
        ...yo.context,
        publicDeployments
      }
    );
  }
  if (configMaps.length) {
    yo.fs.copyTpl(
      yo.templatePath('templates/configmap.yaml'),
      yo.destinationPath('templates/configmap.yaml'),
      {
        ...yo.context,
        configMaps
      }
    );
  }
  if (configSecrets.length) {
    yo.fs.copyTpl(
      yo.templatePath('templates/secret.yaml'),
      yo.destinationPath('templates/secret.yaml'),
      {
        ...yo.context,
        configSecrets
      }
    );
  }
  yo.context.deployments.forEach(deployment => {
    const context = {
      ...yo.context,
      deployment
    };
    if (deployment.public) {
      yo.fs.copyTpl(
        yo.templatePath('templates/deployments/public.yaml'),
        yo.destinationPath(`templates/deployments/${deployment.name}.yaml`),
        context
      );
      yo.fs.copyTpl(
        yo.templatePath('templates/services/public.yaml'),
        yo.destinationPath(`templates/services/${deployment.name}.yaml`),
        context
      );
      yo.fs.copyTpl(
        yo.templatePath('templates/ingress.yaml'),
        yo.destinationPath(`templates/ingresses/${deployment.name}.yaml`),
        context
      );
    } else {
      yo.fs.copyTpl(
        yo.templatePath('templates/deployments/private.yaml'),
        yo.destinationPath(`templates/deployments/${deployment.name}.yaml`),
        yo.context
      );
      yo.fs.copyTpl(
        yo.templatePath('templates/services/private.yaml'),
        yo.destinationPath(`templates/services/${deployment.name}.yaml`),
        context
      );
    }
  });
}
