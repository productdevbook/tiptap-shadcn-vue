<template>
  <Notivue v-slot="item">
  <Notification :item="item">
    <NotificationProgress :item="item" />
  </Notification>
  </Notivue>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout> 
</template>
