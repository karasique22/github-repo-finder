import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
interface RepoCardProps {
  full_name: string;
  description?: string | null;
  stars: number;
  updatedAt: string;
  url: string;
}

const RepoCard: React.FC<RepoCardProps> = ({
  full_name,
  description,
  stars,
  updatedAt,
  url,
}) => {
  return (
    <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col justify-between'>
      <div>
        <h2 className='text-xl font-semibold mb-2'>
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-blue-600'
          >
            {full_name}
          </a>
        </h2>
        {description ? (
          <p className='text-gray-600 mb-4'>{description}</p>
        ) : (
          <p className='text-gray-600 mb-4 italic'>Описание отсутствует</p>
        )}
      </div>

      <div className='flex justify-between items-center'>
        <span className='text-sm text-gray-500'>
          Обновлен {formatDistanceToNow(new Date(updatedAt), { locale: ru })}{' '}
          назад
        </span>
        <div className='flex items-center'>
          <span className='text-yellow-500'>★</span>
          <span className='ml-1'>{stars}</span>
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
