import { commonEnvironment } from './environment.common';

const env:Partial<typeof commonEnvironment> = {titleApp: 'VikingoTech - Development'};

export const environment = {...commonEnvironment, ...env};

