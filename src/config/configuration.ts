import { Transactions, Merchants, Users, Cards } from 'src/db/models';
import { ConfigHelper } from 'src/helper/helper.controller';
import { IDatabaseConfig } from 'src/interfaces/dbconfig';

export class ExtTransactionsDB implements IDatabaseConfig {
  constructor(private configHelper: ConfigHelper) {}
  host = this.configHelper.getDatabaseHost();
  port = parseInt(this.configHelper.getDatabasePort());
  username = this.configHelper.getDatabaseUser();
  password = this.configHelper.getDatabasePassword();
  database = this.configHelper.getDatabaseName();
  
  models = [Transactions, Merchants, Users, Cards];
}
