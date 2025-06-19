import { Injectable } from '@angular/core';
import { UserModel } from '../../../domain/models/user/user.model';
import { environment } from '../../../environtments/environtment.development';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class UserService  {

  getUsers(): Promise<any>{
    return axios.get(environment.apiUrl+'/User');
  }

  getUser(id: number): Promise<any>{
    return axios.get(environment.apiUrl+'/User/'+id);
  }
 
  addUser(user?: UserModel): Promise<any>{   
    return axios.post(environment.apiUrl+'/User', user);
  }
 
  deleteUser(id:number): Promise<any>{
    return axios.delete(environment.apiUrl+'/User/' + id);
  }
 
  updateUser(id: number, user: UserModel): Promise<any>{    
    return axios.put(environment.apiUrl+'/User/' + id, user);
  }

  getAllBranch(): Promise<any>{
    return axios.get(environment.apiUrl+'/Branch/getBranch');
  }

}