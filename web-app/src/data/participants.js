export function getParticipantsStore() {
  const stringifiedParticipants = localStorage.getItem('participants-store');
  return stringifiedParticipants
    ? JSON.parse(stringifiedParticipants)
    : INITIAL_PARTICIPANTS_STORE;
}

export function setParticipantsStore(participants) {
  return localStorage.setItem('participants-store', JSON.stringify(participants));
}

export async function getMany({ paginationModel, filterModel, sortModel }) {
  const participantsStore = getParticipantsStore();

  let filteredParticipants = [...participantsStore];

  // Apply filters (example only)
  if (filterModel?.items?.length) {
    filterModel.items.forEach(({ field, value, operator }) => {
      if (!field || value == null) {
        return;
      }

      filteredParticipants = filteredParticipants.filter((participant) => {
        const participantValue = participant[field];

        switch (operator) {
          case 'contains':
            return String(participantValue)
              .toLowerCase()
              .includes(String(value).toLowerCase());
          case 'equals':
            return participantValue === value;
          case 'startsWith':
            return String(participantValue)
              .toLowerCase()
              .startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(participantValue)
              .toLowerCase()
              .endsWith(String(value).toLowerCase());
          case '>':
            return participantValue > value;
          case '<':
            return participantValue < value;
          default:
            return true;
        }
      });
    });
  }

  // Apply sorting
  if (sortModel?.length) {
    filteredParticipants.sort((a, b) => {
      for (const { field, sort } of sortModel) {
        if (a[field] < b[field]) {
          return sort === 'asc' ? -1 : 1;
        }
        if (a[field] > b[field]) {
          return sort === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  }

  // Apply pagination
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize;
  const paginatedParticipants = filteredParticipants.slice(start, end);

  return {
    items: paginatedParticipants,
    itemCount: filteredParticipants.length,
  };
}

export async function getOne(participantId) {
  const participantsStore = getParticipantsStore();

  const participantToShow = participantsStore.find(
    (participant) => participant.id === participantId,
  );

  if (!participantToShow) {
    throw new Error('Participant not found');
  }
  return participantToShow;
}

export async function createOne(data) {
  const participantsStore = getParticipantsStore();

  const newParticipant = {
    id: participantsStore.reduce((max, participant) => Math.max(max, participant.id), 0) + 1,
    ...data,
  };

  setParticipantsStore([...participantsStore, newParticipant]);

  return newParticipant;
}

export async function updateOne(participantId, data) {
  const participantsStore = getParticipantsStore();

  let updatedParticipant = null;

  setParticipantsStore(
    participantsStore.map((participant) => {
      if (participant.id === participantId) {
        updatedParticipant = { ...participant, ...data };
        return updatedParticipant;
      }
      return participant;
    }),
  );

  if (!updatedParticipant) {
    throw new Error('Participant not found');
  }
  return updatedParticipant;
}

export async function deleteOne(participantId) {
  const participantsStore = getParticipantsStore();

  setParticipantsStore(participantsStore.filter((participant) => participant.id !== participantId));
}


export function validate(participant) {
  let issues = [];

  if (!participant.firstName) {
    issues = [...issues, { message: 'First Name is required', path: ['firstName'] }];
  }

  if (!participant.lastName) {
    issues = [...issues, { message: 'Last Name is required', path: ['lastName'] }];
  }

  if (!participant.birthDate) {
    issues = [...issues, { message: 'Birth date is required', path: ['birthDate'] }];
  }

  if (!participant.email) {
    issues = [...issues, { message: 'Email is required', path: ['email'] }];
  }

  if (!participant.phoneNumber) {
    issues = [...issues, { message: 'Phone number is required', path: ['phoneNumber'] }];
  }

  if (!participant.password) {
    issues = [...issues, { message: 'Password is required', path: ['password'] }];
  }

  return { issues };
}
