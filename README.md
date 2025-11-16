# CatCodingChallenge
This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.8.

## Notes
- Zones loaded from static JSON (`mock-data/map.json`) to simulate loading from external source
- Truck position updates every 2 seconds using RxJS interval
- Single truck (T-001) cycles through zones sequentially
- Target that points a truck to a zone is random point within Loading or Dump zones
- Truck movement random step size between 80 and 120 px with random offsets between 0 and 30px for natural movement (wobble)
- For simplicity speed is calculated as step/2 
- There's a 20% chance to stop briefly during movement to demonstrate all statuses
- Truck can't go out of map boundaries, its position gets clamped to stay within map bounds
- Loading/Dumping status - truck's center point is inside a zone
- Hauling status - truck is moving (speed > 0) outside of Loading/Dumping zones
- Idle status - truck is stationary (speed = 0) outside of Loading/Dumping zones

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
