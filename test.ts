// This file is required by karma.conf.js and sets up the Angular testing environment.
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// ✅ Initialize the Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// ✅ Auto-load all *.spec.ts files
const context = (require as any).context('./', true, /\.spec\.ts$/);
context.keys().forEach(context);
