import React from "react";
import { FlatList } from "react-native";
import TransactionItem from "./TransactionItem";
import EmptyState from "./EmptyState";
import { useLanguage } from "../context/LanguageContext";

export default function TransactionList({ transactions, loading, onEdit, onDelete, onRefresh, refreshing, ListHeaderComponent }) {
  const { t } = useLanguage();

  if (!loading && transactions.length === 0) {
    return (
      <EmptyState
        icon="receipt-outline"
        title={t("transaction.noTransactionsTitle")}
        subtitle={t("transaction.noTransactionsSubtitle")}
      />
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionItem transaction={item} onEdit={onEdit} onDelete={onDelete} />}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
