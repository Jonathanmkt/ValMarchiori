export function ProductsTableHeader() {
  return (
    <div className='sticky top-0 bg-dashboard-background z-20 pt-4 pb-4 px-0 hidden md:block'>
      <div className='flex w-[calc(100%-12px)] mx-1.5'>
        {/* Coluna Nome com mesma estrutura da linha */}
        <div className='w-[35%] py-3 px-4 flex items-center gap-3'>
          {/* Espaço do botão chevron */}
          <div className='w-8'></div>
          {/* Espaço do avatar */}
          <div className='w-10'></div>
          {/* Título Nome */}
          <span className='text-sm font-medium'>Nome Completo</span>
        </div>

        {/* Email */}
        <div className='w-[20%] py-3 px-4 flex items-center'>
          <div className='text-sm font-medium'>Email</div>
        </div>

        {/* Chat ID */}
        <div className='w-[20%] py-3 px-4 flex items-center'>
          <div className='text-sm font-medium'>Telefone</div>
        </div>

        {/* Status */}
        <div className='w-[15%] py-3 px-4 flex items-center'>
          <div className='text-sm font-medium'>Status</div>
        </div>

        {/* Ações */}
        <div className='w-[10%] py-3 px-4 flex justify-center'>
          <span className='text-sm font-medium'>Ações</span>
        </div>
      </div>

    </div>
  );
}
