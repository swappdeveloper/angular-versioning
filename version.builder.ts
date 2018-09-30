import { Builder, BuilderConfiguration, BuilderContext, BuildEvent } from '@angular-devkit/architect';
import { bindNodeCallback, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { VersionBuilderSchema } from './schema';
import { getSystemPath } from '@angular-devkit/core';
import * as dateFormat from 'dateformat';
// import { writeFile } from 'fs';
const fs = require('fs');

export default class VersionBuilder implements Builder<VersionBuilderSchema> {
  constructor(private context: BuilderContext) {
  }

  run(builderConfig: BuilderConfiguration<Partial<VersionBuilderSchema>>): Observable<BuildEvent> {
    const root = this.context.workspace.root;
    const { destPath, format, version } = builderConfig.options;
    const filename = `${getSystemPath(root)}/${destPath}`;
    const filenames = [
      `${filename}.json`,
      `${filename}.development.json`,
      `${filename}.production.json`,
      `${filename}.test.json`
    ];

    filenames.forEach((name, index) => {
      if (fs.existsSync(name)) {
        let rowData = fs.readFileSync(name);
        let data = JSON.parse(rowData.toString());
        let versionArray = data.version.split('.');
        let minorIncrement = Number(versionArray[versionArray.length - 1]) + 1;
        versionArray[versionArray.length - 1] = minorIncrement.toString();
        let newVersion = versionArray.join('.');
        data.version = newVersion;
        data.date = dateFormat(new Date(), format);
        console.info(dateFormat(new Date(), format), data, data.version, newVersion);

        fs.writeFileSync(name, JSON.stringify(data));
      }
    });

    return of({ success: true });
  }
}
