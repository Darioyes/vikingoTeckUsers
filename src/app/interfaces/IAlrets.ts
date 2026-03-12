export interface IAlert {
  icon: string;
  message: string | Object;
}

export interface IAlertConfirm {
  icon: string;
  message: string | Object;
  area: string;
  id:any;
}

export interface IAlertDelete {
  id:any,
  response :boolean
}