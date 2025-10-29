import React from 'react';
import Dialog from 'react-native-dialog';

export default function LogoutDialog({ visible, onCancel, onConfirm, title, description }) {
  return (
    <Dialog.Container visible={visible}>
      <Dialog.Title>{title || 'Confirmar Logout'}</Dialog.Title>
      <Dialog.Description>
        {description || 'Tem certeza que deseja sair da conta?'}
      </Dialog.Description>
      <Dialog.Button label="Cancelar" onPress={onCancel} />
      <Dialog.Button label="Sair" onPress={onConfirm} />
    </Dialog.Container>
  );
}
