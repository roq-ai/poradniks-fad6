import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface HomeOwnerInterface {
  id?: string;
  user_id?: string;
  request_status: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface HomeOwnerGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  request_status?: string;
}
