export type Value = {
  value: number;
}

export type Graph = {
  date: string;
  value: number;
}

export type Team = {
  member: string;
  value: number;
}

export type Member = {
  value: string;
  label: string;
}

export type Messages = {
  date: string;
  whatsapp: number;
  email: number;
}

export type InsightsProps = {
  newClients: Value;
  invoicesGenerated: Value;
  messagesSended: Value;
  presumedRevenue: Value;
  teamClients: Team[] | [];
  invoices: Graph[] | [];
  forecastRevenue: Graph[] | [];
  distributionMessages: Messages[] | [];
};